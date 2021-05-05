FROM nginx AS builder

RUN apt-get update -y
RUN apt-get install python3 python3-pip -y
RUN pip3 install --user uwsgi
RUN pip3 install --user flask
RUN pip3 install --user Pillow
RUN pip3 install --user sklearn

FROM nginx

#COPY --from=builder /usr/bin/python3 /usr/bin/python3
#COPY --from=builder /usr/local/bin/uwsgi /usr/local/bin/uwsgi
#COPY --from=builder /usr/local/lib/python3.7/dist-packages/ /usr/local/lib/python3.7/dist-packages/
#COPY --from=builder /usr/lib/x86_64-linux-gnu/*python* /usr/lib/x86_64-linux-gnu/

RUN apt-get update -y
RUN apt-get install python3 uwsgi -y

#Copy packages without pip and all its dependencies
COPY --from=builder /root/.local /root/.local
COPY --from=builder /usr/lib/x86_64-linux-gnu/*python* /usr/lib/x86_64-linux-gnu/

ENV PATH=/root/.local/bin:$PATH

ADD frontend/* /usr/share/nginx/html/
ADD backend/* /backend/
ADD nginx_configuration/nginx.conf /etc/nginx/nginx.conf
ADD init.sh /

ENTRYPOINT ["/init.sh"]