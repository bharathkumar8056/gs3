# Create a temporary directory for your code without videos
mkdir temp-project
cd temp-project

# Copy everything except videos and node_modules
xcopy /E /exclude:node_modules,public\assets\videos ..\* .

# Initialize a new git repository
git init
git add .
git commit -m "Initial commit without videos"

# Create a new GitHub repository at github.com
# Then push to it:
git remote add origin https://github.com/bharathkumar8056/gs3-vercel.git
git push -u origin main
