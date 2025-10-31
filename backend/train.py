
import os
import pandas as pd
from PIL import Image, ImageFilter
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, random_split
from torchvision.transforms import transforms
from main import DefectClassifier, clahe_transform

class PipeDataset(Dataset):
    def __init__(self, csv_file, root_dir, transform=None):
        self.labels_df = pd.read_csv(csv_file)
        self.root_dir = root_dir
        self.transform = transform
        self.image_list = os.listdir(root_dir)

    def __len__(self):
        return len(self.image_list)

    def __getitem__(self, idx):
        img_name = self.image_list[idx]
        if img_name == ".DS_Store":
            return self.__getitem__((idx + 1) % len(self.image_list))
        img_path = os.path.join(self.root_dir, img_name)
        image = Image.open(img_path).convert("L")

        # Check if the image is in the defect_labels.csv file
        is_defective = self.labels_df["image"].str.contains(img_name.replace(".jpg", "")).any()
        label = 1 if is_defective else 0

        if self.transform:
            image = self.transform(image)

        return image, label

# Define the transformations
transform = transforms.Compose([
    transforms.Resize((24, 24)),
    transforms.Lambda(clahe_transform),
    transforms.Lambda(lambda x: x.filter(ImageFilter.MedianFilter(size=3))),
    transforms.Lambda(lambda x: x.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

# Create the dataset
dataset = PipeDataset(csv_file="../train_set/defect_labels.csv",
                      root_dir="../train_set/type-b-images",
                      transform=transform)

# Split the dataset into training and validation sets
train_size = int(0.8 * len(dataset))
val_size = len(dataset) - train_size
train_dataset, val_dataset = random_split(dataset, [train_size, val_size])

# Create the data loaders
train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)

# Initialize the model, optimizer, and loss function
model = DefectClassifier()
optimizer = optim.Adam(model.parameters(), lr=0.001)
criterion = nn.BCEWithLogitsLoss()

# Train the model
best_accuracy = 0.0
for epoch in range(10):
    model.train()
    running_loss = 0.0
    for images, labels in train_loader:
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels.float().unsqueeze(1))
        loss.backward()
        optimizer.step()
        running_loss += loss.item()

    print(f"Epoch {epoch+1}, Loss: {running_loss/len(train_loader)}")

    # Validate the model
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for images, labels in val_loader:
            outputs = model(images)
            predicted = torch.sigmoid(outputs) > 0.5
            total += labels.size(0)
            correct += (predicted == labels.unsqueeze(1)).sum().item()

    accuracy = correct / total
    print(f"Validation Accuracy: {accuracy}")

    # Save the best model
    if accuracy > best_accuracy:
        best_accuracy = accuracy
        torch.save(model.state_dict(), "defect_classifier_retrained.pth")

print("Finished Training")
