# FROM python:3.9-slim
FROM python:3.12-slim

# 追記：必要なシステムパッケージをインストール
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    && apt-get clean

# Set the working directory
WORKDIR /app

# Copy the requirements file
# COPY backend/requirements.txt .
COPY ./requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
# COPY backend /app
COPY . /app

# Expose the port the app runs on
EXPOSE 5001

# Command to run the application
CMD ["python", "app.py"]