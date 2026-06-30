'use strict';

const DEFAULT_RELEASE = Object.freeze({
  versionCode: 2,
  versionName: '1.0.1',
  title: 'Update available',
  message: 'DOWNitUP 1.0.1 is available. Download the latest version from the website.',
  downloadUrl: 'https://downitup.com',
  releaseNotesUrl: 'https://downitup.com/releases',
  publishedAt: '2026-06-30T00:00:00Z'
});

const PLATFORMS = new Set(['macos', 'windows', 'linux', 'unknown']);
const ARCHITECTURES = new Set(['arm64', 'x64', 'armv7', 'unknown']);
const BOOLEAN_VALUES = new Set(['true', 'false']);

function getDesktopRelease(env = process.env) {
  const versionCode = Number.parseInt(env.DESKTOP_LATEST_VERSION_CODE || '', 10);
  const versionName = env.DESKTOP_LATEST_VERSION_NAME || DEFAULT_RELEASE.versionName;

  return {
    versionCode: Number.isSafeInteger(versionCode) && versionCode >= 0
      ? versionCode
      : DEFAULT_RELEASE.versionCode,
    versionName,
    title: env.DESKTOP_UPDATE_TITLE || DEFAULT_RELEASE.title,
    message: env.DESKTOP_UPDATE_MESSAGE
      || `DOWNitUP ${versionName} is available. Download the latest version from the website.`,
    downloadUrl: env.DESKTOP_DOWNLOAD_URL || DEFAULT_RELEASE.downloadUrl,
    releaseNotesUrl: env.DESKTOP_RELEASE_NOTES_URL || DEFAULT_RELEASE.releaseNotesUrl,
    publishedAt: env.DESKTOP_RELEASE_PUBLISHED_AT || DEFAULT_RELEASE.publishedAt
  };
}

function validateUpdateQuery(searchParams) {
  const versionCodeRaw = searchParams.get('version_code');
  const versionName = searchParams.get('version_name');
  const platform = searchParams.get('platform');
  const arch = searchParams.get('arch');
  const debug = searchParams.get('debug');

  const errors = [];
  const versionCode = Number.parseInt(versionCodeRaw || '', 10);

  if (!versionCodeRaw || !/^\d+$/.test(versionCodeRaw) || !Number.isSafeInteger(versionCode)) {
    errors.push('version_code must be a non-negative integer');
  }

  if (!versionName) {
    errors.push('version_name is required');
  }

  if (!platform || !PLATFORMS.has(platform)) {
    errors.push('platform must be one of macos, windows, linux, unknown');
  }

  if (!arch || !ARCHITECTURES.has(arch)) {
    errors.push('arch must be one of arm64, x64, armv7, unknown');
  }

  if (!debug || !BOOLEAN_VALUES.has(debug)) {
    errors.push('debug must be true or false');
  }

  return {
    ok: errors.length === 0,
    errors,
    value: {
      versionCode,
      versionName,
      platform,
      arch,
      debug: debug === 'true',
      osVersion: searchParams.get('os_version') || ''
    }
  };
}

function buildUpdateResponse(currentVersionCode, release = getDesktopRelease()) {
  const updateAvailable = release.versionCode > currentVersionCode;

  return {
    update_available: updateAvailable,
    latest_version_code: release.versionCode,
    latest_version_name: release.versionName,
    title: updateAvailable ? release.title : '',
    message: updateAvailable ? release.message : '',
    download_url: release.downloadUrl,
    release_notes_url: updateAvailable ? release.releaseNotesUrl : '',
    published_at: updateAvailable ? release.publishedAt : ''
  };
}

function handleUpdateRequest(url, env = process.env) {
  const validation = validateUpdateQuery(url.searchParams);

  if (!validation.ok) {
    return {
      status: 400,
      body: {
        error: 'invalid_request',
        details: validation.errors
      }
    };
  }

  return {
    status: 200,
    body: buildUpdateResponse(validation.value.versionCode, getDesktopRelease(env))
  };
}

module.exports = {
  buildUpdateResponse,
  getDesktopRelease,
  handleUpdateRequest,
  validateUpdateQuery
};
