#!/bin/bash
# === FastDL Sync Script ===
# Sincronizează local ./fastdl_snapshot (folderul file + fișierul list2)
# către un server remote (ex: root@93.115.101.192:/var/www/rage-cache)
# cu opțiunea de test și ștergere sincronizată (--delete)

SOURCE_DIR="./fastdl_snapshot"
DEST_PATH="/var/www/rage-cache"

echo "=== FASTDL SYNC TOOL ==="
echo
read -p "SSH user: " SSH_USER
read -p "Server IP: " SSH_IP
read -s -p "SSH password: " SSH_PASS
echo
echo "------------------------------"
echo "Source: $SOURCE_DIR"
echo "Destination: $SSH_USER@$SSH_IP:$DEST_PATH"
echo "------------------------------"

# verifică dacă sshpass e instalat
if ! command -v sshpass &> /dev/null; then
  echo "❌ sshpass nu este instalat. Instalează-l cu: apt install sshpass -y"
  exit 1
fi

echo
read -p "Vrei să rulezi întâi un test (dry-run)? [y/N]: " DRYRUN

RSYNC_OPTS="-avz --delete -e 'ssh -o StrictHostKeyChecking=no'"

if [[ "$DRYRUN" == "y" || "$DRYRUN" == "Y" ]]; then
  echo "🔍 Rulez testul (dry-run)..."
  sshpass -p "$SSH_PASS" rsync -n $RSYNC_OPTS ${SOURCE_DIR}/{file,list2} ${SSH_USER}@${SSH_IP}:${DEST_PATH}/
  echo
  echo "✅ Dry-run finalizat. Nimic nu a fost modificat."
else
  echo "🚀 Încep sincronizarea reală..."
  sshpass -p "$SSH_PASS" rsync $RSYNC_OPTS ${SOURCE_DIR}/{file,list2} ${SSH_USER}@${SSH_IP}:${DEST_PATH}/
  echo "✅ Sincronizare completă!"
fi
