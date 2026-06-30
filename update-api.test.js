'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const {
  buildUpdateResponse,
  getDesktopRelease,
  handleUpdateRequest,
  validateUpdateQuery
} = require('./update-api');

test('returns an update when the release version code is newer', () => {
  const response = buildUpdateResponse(1, {
    versionCode: 2,
    versionName: '1.0.1',
    title: 'Update available',
    message: 'DOWNitUP 1.0.1 is available.',
    downloadUrl: 'https://downitup.com',
    releaseNotesUrl: 'https://downitup.com/releases',
    publishedAt: '2026-06-30T00:00:00Z'
  });

  assert.deepEqual(response, {
    update_available: true,
    latest_version_code: 2,
    latest_version_name: '1.0.1',
    title: 'Update available',
    message: 'DOWNitUP 1.0.1 is available.',
    download_url: 'https://downitup.com',
    release_notes_url: 'https://downitup.com/releases',
    published_at: '2026-06-30T00:00:00Z'
  });
});

test('returns no prompt text when the client is already current', () => {
  const response = buildUpdateResponse(2, {
    versionCode: 2,
    versionName: '1.0.1',
    title: 'Update available',
    message: 'DOWNitUP 1.0.1 is available.',
    downloadUrl: 'https://downitup.com',
    releaseNotesUrl: 'https://downitup.com/releases',
    publishedAt: '2026-06-30T00:00:00Z'
  });

  assert.equal(response.update_available, false);
  assert.equal(response.title, '');
  assert.equal(response.message, '');
  assert.equal(response.release_notes_url, '');
  assert.equal(response.published_at, '');
  assert.equal(response.download_url, 'https://downitup.com');
});

test('validates the required desktop client query fields', () => {
  const params = new URLSearchParams({
    version_code: '1',
    version_name: '1.0.0',
    platform: 'macos',
    arch: 'arm64',
    debug: 'false',
    os_version: 'Mac OS X 14.5'
  });

  const result = validateUpdateQuery(params);

  assert.equal(result.ok, true);
  assert.equal(result.value.versionCode, 1);
  assert.equal(result.value.platform, 'macos');
  assert.equal(result.value.arch, 'arm64');
  assert.equal(result.value.debug, false);
  assert.equal(result.value.osVersion, 'Mac OS X 14.5');
});

test('rejects invalid query fields', () => {
  const result = validateUpdateQuery(new URLSearchParams({
    version_code: '-1',
    version_name: '1.0.0',
    platform: 'ios',
    arch: 'riscv',
    debug: '0'
  }));

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /version_code/);
  assert.match(result.errors.join('\n'), /platform/);
  assert.match(result.errors.join('\n'), /arch/);
  assert.match(result.errors.join('\n'), /debug/);
});

test('uses environment overrides for desktop release metadata', () => {
  const release = getDesktopRelease({
    DESKTOP_LATEST_VERSION_CODE: '7',
    DESKTOP_LATEST_VERSION_NAME: '2.1.0',
    DESKTOP_DOWNLOAD_URL: 'https://downitup.com/download',
    DESKTOP_RELEASE_PUBLISHED_AT: '2026-07-01T00:00:00Z'
  });

  assert.equal(release.versionCode, 7);
  assert.equal(release.versionName, '2.1.0');
  assert.equal(release.downloadUrl, 'https://downitup.com/download');
  assert.equal(release.publishedAt, '2026-07-01T00:00:00Z');
  assert.match(release.message, /2\.1\.0/);
});

test('handles the documented endpoint shape', () => {
  const url = new URL('https://downitup.com/checkupdate/downitup/desktop?version_code=1&version_name=1.0.0&platform=macos&arch=arm64&debug=false&os_version=Mac%20OS%20X%2014.5');
  const result = handleUpdateRequest(url, {
    DESKTOP_LATEST_VERSION_CODE: '2',
    DESKTOP_LATEST_VERSION_NAME: '1.0.1'
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.update_available, true);
  assert.equal(result.body.latest_version_code, 2);
  assert.equal(result.body.latest_version_name, '1.0.1');
});
