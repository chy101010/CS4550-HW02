server {
	listen 80;
	listen [::]:80;

	root /home/ning/www/CS4550-HW02;

	index index.html;

	server_name hw02.citronk.com;

	location / {
		try_files $uri $uri/ =404;
	}
}
