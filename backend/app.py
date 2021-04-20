
from flask import Flask, current_app, url_for, request
from PIL import Image, ImageShow
import io
from joblib import load

app = Flask(__name__, static_url_path='', static_folder='static')

knn_classifier = load("knn.joblib")

@app.route('/test')
def test():
	return 'Hello, World!'

@app.route('/upload', methods=['POST'])
def process_image():
	file = io.BytesIO(request.get_data())

	img = Image.open(file, "r", formats=["jpeg"])
	img = img.resize((28,28))
	img = img.convert("L")
	img = list(img.getdata())
	img = [255 if i>0 else 0 for i in img]

	print(img)

	tmp = ["#" if i!=0 else "." for i in img]
	for i in range(28):
		for j in range(28):
			print(tmp[i*28+j], end=" ")
		print()
	print()

	prediction = knn_classifier.predict([img])

	print(prediction[0])

	#print(list(img.getdata()))

	

	#print(request.get_data())
	#print(len(request.get_data()))
	#file = open("tmp.jpeg", "wb")
	#file.write(request.get_data())
	#file.close()

	return prediction;

#@app.route('/')
#def hello_world():
#    return 'Hello, World!'