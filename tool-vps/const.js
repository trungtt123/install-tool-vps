require('dotenv').config()
const FOLDER_PROFILE = 'D:\\Profiles';
const API_GPM_URL = 'http://127.0.0.1:7070/v1';
const API_PYTHON_URL = 'http://127.0.0.1:5001';
const API_NGROK_URL = 'http://127.0.0.1:4040';
const CONFIG_ROOT = process.env.CONFIG_ROOT;
const DATABASE_URL = process.env.DATABASE_URL;
const PROFILES_PATH = process.env.PROFILES_PATH;
const NGROK_PATH = process.env.NGROK_PATH;
const PYTHON_VPS_PATH = process.env.PYTHON_VPS_PATH;
module.exports = {
    API_PYTHON_URL,
    CONFIG_ROOT,
    API_NGROK_URL,
    FOLDER_PROFILE,
    API_GPM_URL,
    DATABASE_URL,
    PROFILES_PATH,
    NGROK_PATH,
    PYTHON_VPS_PATH
};