

---

# Startup and Investors Match Platform 🚀💼

Welcome to the **Startup and Investors Match Platform**! This platform connects startups and investors, making it easier for startups to pitch their ideas and for investors to find the right opportunities. With an AI-driven matchmaking feature, this platform streamlines the connection process, empowering startups and investors alike.

### Features ✨
- **Startup Registration**: Startups can register and upload their legal documents for verification.
- **Investor Matchmaking**: Investors can use AI to find the most suitable startups based on their preferences and needs.
- **Pitching**: Startups can submit pitch requests to investors, and if approved, they can schedule meetings.
- **Calendar Integration**: Meetings are automatically added to both the investor's and the startup's calendar and meeting tabs.
  
---

### Project Flow 🌐
- **Startups**:
  - Register and upload legal documents.
  - Wait for verification by the admin.
  - Submit pitch requests to investors.
  - Schedule meetings if an investor approves the pitch.

- **Investors**:
  - Register and get matched with suitable startups via the AI matchmaking system.
  - Review pitches and approve or reject them.
  - Schedule meetings with the startups.

- **Admin**:
  - Verify documents and handle admin tasks.
  - Manage startup and investor profiles.

---

### Routes 🚪

- **Investor Dashboard**:  
  `http://localhost:3000/application/`

- **Startup Dashboard**:  
  `http://localhost:3000/startups/`

- **Admin Dashboard**:  
  `http://localhost:3000/admin`

---

### Steps to Start the Project 🛠️

1. **Download the ZIP Folder**
   - First, download the ZIP folder containing the project files.

2. **Frontend Setup**
   - Navigate to the `client` directory:
     ```bash
     cd client
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend server:
     ```bash
     npm start
     ```

   This will start the frontend on `http://localhost:3000`.

3. **Backend Setup (Express Server)**
   - Navigate to the `server` directory:
     ```bash
     cd server
     ```
   - Install backend dependencies:
     ```bash
     npm install
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

   This will start the backend on `http://localhost:5000`.

4. **Django Setup (Virtual Environment & Database)**
   - Navigate to `server/mitaalandi/startup` and create a virtual environment:
     ```bash
     cd server/mitaalandi/startup
     python -m venv venv
     source venv/bin/activate   # For Linux/Mac
     venv\Scripts\activate      # For Windows
     ```
   - Install required dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Apply database migrations:
     ```bash
     python manage.py makemigrations
     python manage.py migrate
     ```

5. **Configuration Files**
   - Add all the required fields in the `credentials.json` and `.env` files for the correct operation of the application.

6. **You're Ready to Go!**
   - After completing the setup, your platform is ready to run! 🎉

---

### Technologies Used ⚙️
- **Frontend**: ReactJS, CSS, HTML
- **Backend**: ExpressJS, NodeJS
- **Database**: Django, PostgreSQL
- **AI**: AI-powered matchmaking feature for investors
- **Authentication**: JWT for user sessions

---

### Contributing 🤝
We welcome contributions to make this project even better. Feel free to fork, submit issues, and send pull requests!

---

### License 📄
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

