#!/bin/bash
# Exit immediately if a command exits with a non-zero status.
set -e

echo 'running bootstrap.sh script to setup vanilla docker cassandra node :)'
echo "$1"
echo "$2"
echo "$@"
# If we're starting cassandra, -a logical and
if [ "$1" = 'cassandra' -a "$2" = '-f' ]; then
  # See if we've already completed bootstrapping
  # -f checks if file already exists:
  if [ ! -f cassnode_bootstrapped ]; then
    echo 'Setting up vanilla cassandra'

    # Invoke the entrypoint script to start DSE as a background job and get the pid
    # starting DSE in the background the first time allows us to monitor progress and register schema
    echo '=> Starting cassandra docker machine'
    /usr/local/bin/docker-entrypoint.sh "$@" &
    cass_pid="$!"

    echo "$cass_pid"

    # Wait for port 9042 (CQL) to be ready for up to 240 seconds
    echo '=> waiting for cassandra to become available'
    /wait-for-it.sh -t 240 127.0.0.1:9042
    echo '=> cassandra is available'

    # Create the keyspace if necessary
    echo '=> Ensuring keyspace is created'
    cqlsh -f /root/user_keyspace.cql 127.0.0.1 9042
    cqlsh -f /root/management_keyspace.cql 127.0.0.1 9042

    # Shutdown DSE after bootstrapping to allow the entrypoint script to start normally
    echo '=> shutting down cassandra process after bootstrapping'
    kill -s TERM "$cass_pid"

    # DSE will exit with code 143 (128 + 15 SIGTERM) once stopped
    set +e
    wait "$cass_pid"
    if [ $? -ne 143 ]; then
      echo >&2 'cassandra setup failed'
      exit 1
    fi
    set -e

    # Don't bootstrap next time we start
    touch cassnode_bootstrapped

    # Now allow DSE to start normally below
    echo 'tables and cassandra are setup, now regular start of container'
  fi
fi

# Run the main entrypoint script from the base image
exec /usr/local/bin/docker-entrypoint.sh "$@"
