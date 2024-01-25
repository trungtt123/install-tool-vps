import speech_recognition as sr
from pydub import AudioSegment
import os
absolute_path = os.path.dirname(os.path.abspath(__file__))

def mp3_to_wav(mp3_file, wav_file):
    audio = AudioSegment.from_mp3(mp3_file)
    audio.export(wav_file, format="wav")
r = sr.Recognizer()

def speech_to_text(file_path_name):
    try:
        mp3_file_path = absolute_path + "/file/" + file_path_name + ".mp3"
        wav_file_path = absolute_path + "/file/" + file_path_name + ".wav"
        mp3_to_wav(mp3_file_path, wav_file_path)
        # Exception handling to handle exceptions at runtime
        # Use the WAV file as a source for input.
        with sr.AudioFile(wav_file_path) as source:
            # Adjust for ambient noise
            r.adjust_for_ambient_noise(source, duration=0.2)
            
            # Listen for the user's input
            audio = r.listen(source)
            
            # Using Google to recognize audio
            text_result = r.recognize_google(audio)
            text_result = text_result.lower()
            return text_result
    except Exception as e:
        print(e)
        return ""
    
