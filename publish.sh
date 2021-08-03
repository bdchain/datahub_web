#!/bin/bash
#########################################################################
# Author: yaofei
# File Name: publish.sh
# Description: 上线脚本
#########################################################################

# rsync -avzP --delete dist/datahub_web/ root@170.106.6.136:/var/www/datahub_web
rsync -avzP --delete dist/en/ root@170.106.6.136:/var/www/datahub-web/en
rsync -avzP --delete dist/zh/ root@170.106.6.136:/var/www/datahub-web/zh
