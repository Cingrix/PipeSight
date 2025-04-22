readme_content = """
# 🧠 Automated Defect Detection using Image Processing & Deep Learning  

## 💡 **Project Overview**
This project is designed to automate the detection of defects in images using a combination of **image processing** techniques and a **Convolutional Neural Network (CNN)** model. The primary goal is to assist industries in enhancing **quality control** by quickly and accurately identifying defective regions in product images.

---

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
