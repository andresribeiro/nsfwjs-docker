FROM node:26-bookworm-slim
WORKDIR /usr/app

RUN apt-get update && \
    # jemalloc is required by sharp for "long-running, multi-threaded processes that involve lots of small memory allocations"
    # https://sharp.pixelplumbing.com/install/#linux-memory-allocator
    # libjemalloc2 (runtime) + python3/make/g++ (arm64 TensorFlow build)
    apt-get install -y --no-install-recommends libjemalloc2 ca-certificates python3 make g++ && \
    # Locates the exact path of the installed libjemalloc.so.2 (which changes depending on the CPU architecture, x86_64 and arm64)
    # and creates a standardized symlink at /usr/lib/ so LD_PRELOAD can reliably find it
    ln -sf "$(dpkg -L libjemalloc2 | grep -m1 'libjemalloc\.so\.2$')" /usr/lib/libjemalloc.so.2 && \
    # Clean up apt caches to minimize image size
    rm -rf /var/lib/apt/lists/*

ENV LD_PRELOAD=/usr/lib/libjemalloc.so.2
ENV TF_CPP_MIN_LOG_LEVEL=1

COPY package.json package-lock.json ./

# @tensorflow/tfjs-node ships an N-API binary for x64, but ARM builds it from
# source (see https://github.com/tensorflow/tfjs/issues/8603)
RUN npm ci && \
    if [ "$(uname -m)" = "aarch64" ]; then npm rebuild @tensorflow/tfjs-node --build-from-source; fi

COPY . .
EXPOSE 3333
CMD ["node", "entry.ts"]
