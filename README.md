# 🛤️OnTrack

## 🐳 Building steps
(First-time installation)
1. Install docker and run its deamon
2. run `FORCE_CREATE_NOVOLUME.sh` to create the mongodb image
3. execute `docker compose build`

## ⚙️ Run the application
- Run docker deamon 
- execute `docker compose up -d`
- connect to <host_ip>:5173 (usually `localhost:5173`)

## ⛔ Stop the application
- execute `docker compose down`