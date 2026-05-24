FROM denoland/deno:debian
WORKDIR /usr/app

RUN apt-get update && \
    # Install required tools to build TensorFlow from source
    # Nodejs is required to run postinstall scripts for TensorFlow
    # NPM is required to rebuild TensorFlow as Deno doesn't have a rebuild command
    apt-get install -y --no-install-recommends libjemalloc2 nodejs npm ca-certificates python3 make g++ && \
    # Locates the exact path of the installed libjemalloc.so.2 (which changes depending on the CPU architecture, x86_64 and arm64)
    # and creates a standardized symlink at /usr/lib/ so LD_PRELOAD can reliably find it
    ln -sf "$(dpkg -L libjemalloc2 | grep -m1 'libjemalloc\.so\.2$')" /usr/lib/libjemalloc.so.2 && \
    # Clean up apt caches to minimize image size
    rm -rf /var/lib/apt/lists/*

# jemalloc is required by sharp for "long-running, multi-threaded processes that involve lots of small memory allocations"
# https://sharp.pixelplumbing.com/install/#linux-memory-allocator
ENV LD_PRELOAD=/usr/lib/libjemalloc.so.2

COPY deno.json deno.lock ./

# Build TensorFlow from source as required for ARM
# https://github.com/tensorflow/tfjs/issues/8603
RUN deno ci && npm rebuild @tensorflow/tfjs-node --build-from-source

COPY . .
EXPOSE 3333
CMD ["deno", "task", "start"]
