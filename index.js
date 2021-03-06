const moment = require('moment')
const getReleaseByCommit = require('./lib/get_release_by_commit')
const getReleaseNote = require('./lib/get_release_note')
const parseReleaseNotes = require('./lib/parse_release_notes')
const updateContent = require('./lib/git/update_content')


const createBranchList = require('./lib/create_branch_list')
const branches = createBranchList({
  time: moment(Date.now()).format('YYYY-MM'),
  months: {before: 8, after: 4}
})

// main application
module.exports = async ({token, owner, repo, sha, tag} = {}) => {
  const release = await getReleaseByCommit({owner, repo, sha, token, branches})
  if (!release) {
    return `commit ${sha} not found in ${owner}/${repo} in the white listed release branches \n\r${branches.join('\n\r')}`
  }

  const path = `releases/${release.branchName}.md`
  const {releaseNote, branchName} = await getReleaseNote({
    owner: 'livingdocsIO',
    repo: 'livingdocs-release-notes',
    path,
    token,
    releaseName: release.branchName
  })

  // base64 to string
  const originReleaseNote = Buffer.from(releaseNote.content, 'base64').toString('utf8')

  const parsedReleaseNote = parseReleaseNotes({
    owner,
    repo,
    releaseNote: originReleaseNote,
    tag,
    path,
    message: release.message
  })

  const parsedBase64ReleaseNote = Buffer.from(parsedReleaseNote).toString('base64')

  await updateContent({
    owner: 'livingdocsIO',
    repo: 'livingdocs-release-notes',
    token,
    path,
    message: `chore: update patch release notes of ${release.branchName}.md with tag ${tag}`,
    content: parsedBase64ReleaseNote,
    sha: releaseNote.sha,
    branch: branchName
  })

  return `update of release-notes with tag ${tag} at ${releaseNote.html_url} sucessfull`
}
