// Prepare one continuous buffer so looping never depends on JavaScript timers.
export function createSeamlessLoop(context, buffer) {
  const channels = Array.from({ length: buffer.numberOfChannels }, (_, channel) => buffer.getChannelData(channel));
  const windowSize = Math.max(1, Math.round(buffer.sampleRate * 0.01));
  const levels = [];
  let peak = 0;

  // Measure short windows to remove encoder padding and quiet lead-in/out.
  for (let start = 0; start < buffer.length; start += windowSize) {
    const end = Math.min(start + windowSize, buffer.length);
    let energy = 0;
    for (const samples of channels) {
      for (let frame = start; frame < end; frame += 1) {
        energy += samples[frame] ** 2;
      }
    }
    const level = Math.sqrt(energy / ((end - start) * channels.length));
    levels.push(level);
    peak = Math.max(peak, level);
  }

  if (peak === 0) return buffer;
  const threshold = peak * 0.08;
  const first = levels.findIndex((level) => level >= threshold);
  let last = levels.length - 1;
  while (levels[last] < threshold) last -= 1;
  const start = first * windowSize;
  const end = Math.min((last + 1) * windowSize, buffer.length);
  const fadeFrames = Math.min(Math.round(buffer.sampleRate * 0.75), Math.floor((end - start) / 4));
  if (fadeFrames < 2) return buffer;

  const length = end - start - fadeFrames;
  const loop = context.createBuffer(channels.length, length, buffer.sampleRate);
  channels.forEach((samples, channel) => {
    const output = loop.getChannelData(channel);
    output.set(samples.subarray(start + fadeFrames, end));
    for (let frame = 0; frame < fadeFrames; frame += 1) {
      const angle = (frame / (fadeFrames - 1)) * Math.PI / 2;
      // Equal-power overlap maintains the level of the fan's broadband hum.
      output[length - fadeFrames + frame] =
        samples[end - fadeFrames + frame] * Math.cos(angle)
        + samples[start + frame] * Math.sin(angle);
    }
  });
  // The crossfade ends on head[fadeFrames - 1]; the loop resumes at head[fadeFrames].
  return loop;
}
