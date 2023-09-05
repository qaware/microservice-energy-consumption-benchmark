FROM wiremock/wiremock:2.32.0

COPY files /home/wiremock/__files
COPY mappings /home/wiremock/mappings

ENV JAVA_OPTS="-Xmx128m"
EXPOSE 8888

CMD [ "--verbose", "--print-all-network-traffic", "--container-threads=128", "--port=8888" ]