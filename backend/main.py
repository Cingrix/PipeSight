import io
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageFilter
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from skimage import exposure

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the model architecture
class DefectClassifier(nn.Module):
    def __init__(self):
        super(DefectClassifier, self).__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(1, 16, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(16, 32, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2)
        )
        self.fc = nn.Sequential(
            nn.Linear(32 * 6 * 6, 64),
            nn.ReLU(),
            nn.Linear(64, 1)
        )

    def forward(self, x):
        x = self.conv(x)
        x = x.view(-1, 32 * 6 * 6)
        x = self.fc(x)
        return x

# Load the model
model = DefectClassifier()
model.load_state_dict(torch.load("..\defect_classifier_retrained.pth", map_location=torch.device("cpu")))
model.eval()

# Define the image transformations
def clahe_transform(image):
    img_np = np.array(image)
    img_clahe = exposure.equalize_adapthist(img_np, clip_limit=0.03)
    return Image.fromarray((img_clahe * 255).astype(np.uint8))

transform = transforms.Compose([
    transforms.Resize((24, 24)),
    transforms.Grayscale(),
    transforms.Lambda(clahe_transform),
    transforms.Lambda(lambda x: x.filter(ImageFilter.MedianFilter(size=3))),
    transforms.Lambda(lambda x: x.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(image)
        confidence = torch.sigmoid(output).item()
        if confidence < 0.90:
            return {"status": "defect detected", "confidence": confidence}
        else:
            return {"status": "good pipe", "confidence": confidence}