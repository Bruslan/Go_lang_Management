FROM cassandra

# adding keyspace and data schema file
COPY user_keyspace.cql /root
COPY management_keyspace.cql /root

# Copy bootstrap script(s) and make executable
COPY [ "bootstrap.sh", "lib/wait-for-it/wait-for-it.sh", "/" ]
RUN chmod +x bootstrap.sh

# Set the entrypoint to the bootstrap script
ENTRYPOINT [ "/bootstrap.sh" ]

CMD ["cassandra","-f"]
