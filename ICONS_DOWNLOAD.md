# Icons Download List for Portfolio

## Skills Icons (64x64px PNG)
- React: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg
- JavaScript: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg
- Python: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg
- Node.js: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg
- Flutter: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg
- Swift: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg
- Git: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg
- Docker: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg
- AWS: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg
- MongoDB: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg
- MySQL: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg
- Firebase: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg
- Laravel: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg

## Alternative - Skill Icons (Better quality)
Base URL: https://skillicons.dev/icons?i=
- All skills in one: react,js,python,nodejs,flutter,swift,git,docker,aws,mongodb,mysql,firebase,laravel

## Education Icons (128x128px)
- University: https://cdn-icons-png.flaticon.com/128/3002/3002543.png
- Graduation: https://cdn-icons-png.flaticon.com/128/2995/2995620.png
- Certificate: https://cdn-icons-png.flaticon.com/128/2995/2995681.png

## Service Icons (64x64px)
- Mobile Development: https://cdn-icons-png.flaticon.com/128/2991/2991148.png
- AI/ML: https://cdn-icons-png.flaticon.com/128/8637/8637099.png
- iOS Development: https://cdn-icons-png.flaticon.com/128/179/179309.png

## Download Commands (Run in terminal):

# Create directories
mkdir -p public/icons/skills
mkdir -p public/icons/education  
mkdir -p public/icons/services
mkdir -p public/icons/experience

# Download skills icons (using curl)
curl -o public/icons/skills/react.svg "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
curl -o public/icons/skills/javascript.svg "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
curl -o public/icons/skills/python.svg "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
curl -o public/icons/skills/nodejs.svg "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
curl -o public/icons/skills/flutter.svg "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg"
curl -o public/icons/skills/swift.svg "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg"
curl -o public/icons/skills/git.svg "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
curl -o public/icons/skills/docker.svg "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"

# Convert SVG to PNG (if you have imagemagick installed)
# convert public/icons/skills/react.svg -resize 64x64 public/icons/skills/react.png
