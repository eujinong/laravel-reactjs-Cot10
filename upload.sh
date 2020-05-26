rsync -a -v -e "ssh" --rsync-path="sudo rsync" --exclude=node_modules --exclude=storage/logs /Volumes/WORK/work/lumen/sports-management/** ubuntu@132.148.155.246:/var/www/sports/
# ssh softblad@77.104.135.77 -p 18765 << EOF
# cd /home/softblad/public_html/betpolls;
# php71 artisan migrate:refresh;
# EOF