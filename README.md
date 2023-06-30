# Webasyst Teamwork web app #

Webasyst Teamwork is a task tracking app for teams. Set tasks for employees, manage projects, control the deadlines, keep work productive. No task will get lost!

https://www.webasyst.com/store/app/tasks/

## System Requirements ##

	* Web Server
		* e.g. Apache or IIS

	* PHP 7.2+
		* spl extension
		* mbstring
		* iconv
		* json
		* gd or ImageMagick extension

	* MySQL/MariaDB

## Installing Webasyst Framework (required first!) ##

Install Webasyst Framework via https://github.com/webasyst/webasyst-framework/ or https://developers.webasyst.com/

## Installing the Teamwork app (once Webasyst is installed) ##

1. Once Webasyst is installed, get the Teamwork app code into your /PATH_TO_WEBASYST/**wa-apps/tasks/** folder:

		cd /PATH_TO_WEBASYST/wa-apps/
		mkdir tasks
		git clone git://github.com/1312inc/Webasyst-Teamwork.git ./

2. Add the following line into the `wa-config/apps.php` file (this file lists all installed apps):

		'tasks' => true,

3. Done! Run Webasyst backend in a web browser and click on the Teamwork app icon in the main app list. In the app icon is missing, make sure to clear Webasyst cache (flush `wa-cache/` folder contents).
