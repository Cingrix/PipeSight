# 🧠 Automated Defect Detection using Image Processing & Deep Learning  

## 📖 Overview
**PipeSight** is an **AI-powered defect detection system** designed to identify **leaks and defects in industrial pipelines** using **X-ray images**.  
This project integrates a trained deep learning model with a modern, responsive frontend to provide a seamless interface for defect inspection and classification.

---

## ⚙️ Tech Stack

### 🧩 Backend
- **FastAPI** – Lightweight Python web framework for serving the ML model  
- **PyTorch** – Deep learning framework used for model training and inference  
- **Pillow (PIL)** – Image preprocessing and manipulation  
- **NumPy** – Numerical and matrix operations  
- **CORS Middleware** – Enables secure communication between backend and frontend  

### 💻 Frontend
- **React + TypeScript (Vite)** – High-performance frontend framework  
- **Tailwind CSS** – Utility-first CSS framework for building responsive UIs  
- **shadcn/ui & Radix UI** – Accessible and elegant component libraries  
- **Bun / Node.js** – For package management and build processes  

---

## 🗂️ Project Structure

```plaintext
pipe-sight-main/
│
├── backend/                  
│   ├── main.py               # FastAPI backend (model API)
│   ├── train.py              # Model training script
│   ├── package.json          # Backend dependencies (if Node utilities used)
│   └── defect_classifier_retrained.pth  # Trained PyTorch model
│
├── frontend/                 
│   ├── src/                  # React + TypeScript source code
│   ├── public/               # Static assets
│   ├── tailwind.config.ts    # Tailwind CSS configuration
│   ├── vite.config.ts        # Vite configuration
│   └── package.json          # Frontend dependencies
│
└── README.md
```
🚀 How to Run the Project
1️⃣ Clone the Repository
```plaintext
git clone https://github.com/<your-username>/pipe-sight.git
cd pipe-sight-main
```
2️⃣ Setup and Run the Backend
```plaintext
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

3️⃣ Setup and Run the Frontend
```plaintext
cd ../frontend
npm install
npm run dev
```

🧪 Usage

Open the frontend in your browser.

Upload an X-ray image of a pipeline.

The image is sent to the FastAPI backend for processing.

The trained model predicts whether the pipeline is Defective or Normal.

The result is displayed instantly with a confidence score.

---

# 🔬 Model Architecture and Training Process

## ⚙️ **Key Features**
- 🔍 **Defect Extraction:** Uses image masks to extract defect areas from the original images.
- 🏷️ **Label Automation:** Automatically generates labels (Defect / No Defect) based on extracted image data.
- 🤖 **Deep Learning Model:** A lightweight CNN built using PyTorch for binary classification of defects.
- 💾 **Batch Processing:** Efficiently processes and labels large sets of training and test images.
- 📊 **Prediction Output:** Generates CSV reports with predicted defect statuses for easy review.

---

## 🧑‍💻 **Technologies Used**
- Python
- OpenCV
- Matplotlib
- PyTorch
- NumPy
- Pandas

---

## 🗂️ **Project Workflow**

1. **Defect Extraction**  
   Original images and their corresponding ground truth masks are processed. The mask isolates the defective region, creating a clean dataset of defect patches.

2. **Label Generation**  
   Each extracted image is labeled as `1` (Defect Present) or `0` (No Defect) based on pixel inspection.

3. **Model Building**  
   A custom CNN is trained to classify images as defective or non-defective. The model uses convolutional layers for feature extraction and fully connected layers for classification.

4. **Model Training & Evaluation**  
   The model is trained on the labeled dataset, validated, and saved for later inference.

5. **Inference on Test Set**  
   The saved model is used to predict defects on new, unseen test images. The predictions are saved as a `.csv` file for review.
