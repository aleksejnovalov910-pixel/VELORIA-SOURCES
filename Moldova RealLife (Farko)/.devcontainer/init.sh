wget https://cdn.rage.mp/updater/prerelease/server-files/linux_x64.tar.gz
apt update && apt install libstdc++6
tar -xzf linux_x64.tar.gz
rm linux_x64.tar.gz
mkdir -p ./server
mv ./ragemp-srv/* ./server
rm -rf ./ragemp-srv