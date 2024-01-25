from flask import Flask, jsonify, request
from Service.SpeechToText import speechToText

app = Flask(__name__)

@app.route('/api/python-service/speech-to-text', methods=['GET'])
def hello():
    try:
        fileName = request.args.get('fileName')
        message = speechToText.speech_to_text(fileName)
        return jsonify(message=message)
    except:
        return jsonify(message="")

if __name__ == '__main__':
    app.run(port="5001")
