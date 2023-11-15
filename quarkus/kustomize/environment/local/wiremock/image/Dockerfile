FROM wiremock/wiremock:3.3.1

COPY files /home/wiremock/__files
COPY mappings /home/wiremock/mappings

ENV JAVA_OPTS="-Xmx128m"
EXPOSE 8888

# for debugging: CMD [ "--verbose", "--print-all-network-traffic", "--container-threads=128", "--port=8888" ]
CMD [ "--container-threads=128", "--port=8888" ]
