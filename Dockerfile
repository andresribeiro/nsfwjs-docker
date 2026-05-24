FROM denoland/deno:debian
WORKDIR /usr/app
# jemalloc is required by sharp for "long-running, multi-threaded processes that involve lots of small memory allocations"
# https://sharp.pixelplumbing.com/install/#linux-memory-allocator
RUN apt-get update && \
    apt-get install -y --no-install-recommends libjemalloc2 nodejs ca-certificates python3 make g++
RUN ln -sf "$(dpkg -L libjemalloc2 | grep -m1 'libjemalloc\.so\.2$')" /usr/lib/libjemalloc.so.2
ENV LD_PRELOAD=/usr/lib/libjemalloc.so.2
COPY deno.json deno.lock ./
RUN deno ci
COPY . .
EXPOSE 3333
CMD ["deno", "task", "start"]
