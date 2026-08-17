'use strict';

function formatMegabytes(bytes) {
    return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

async function applyReleaseData() {
    const containers = document.querySelectorAll('[data-release-platform]');
    if (containers.length === 0) return;

    try {
        const response = await fetch('/releases.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error(`Release manifest returned ${response.status}`);
        const manifest = await response.json();

        for (const container of containers) {
            const release = manifest.platforms[container.dataset.releasePlatform];
            if (!release) continue;
            const requestedFormat = container.dataset.releaseFormat;
            const artifact = requestedFormat
                ? release.artifacts?.find((item) => item.format.toLowerCase() === requestedFormat.toLowerCase())
                : release.artifacts?.[0];

            container.querySelectorAll('[data-release-version]').forEach((node) => { node.textContent = release.version; });
            container.querySelectorAll('[data-release-status]').forEach((node) => { node.textContent = release.status; });
            if (artifact) {
                container.querySelectorAll('[data-release-link]').forEach((node) => { node.href = artifact.url; });
                container.querySelectorAll('[data-release-size]').forEach((node) => { node.textContent = formatMegabytes(artifact.sizeBytes); });
                container.querySelectorAll('[data-release-sha256]').forEach((node) => { node.textContent = artifact.sha256; });
            }
        }
    } catch (error) {
        console.warn('Using embedded release details because the manifest could not be loaded.', error);
    }
}

applyReleaseData();
