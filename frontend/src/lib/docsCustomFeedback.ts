export default function getGitIssueUrl({
                          repository = "",
                          title,
                          labels
                        }) {
  const repo = gitUrlParse(repository);
  if (!repo) throw new Error("Invalid `docsRepositoryBase` URL!");
  if (repo.origin.includes("gitlab")) {
    return `${repo.origin}/${repo.owner}/${repo.name}/-/issues/new?issue[title]=${encodeURIComponent(title)}${labels ? `&issue[description]=/label${encodeURIComponent(` ~${labels}
`)}` : ""}`;
  }
  if (repo.origin.includes("github")) {
    return `${repo.origin}/${repo.owner}/${repo.name}/issues/new?title=${encodeURIComponent(title)}&labels=${labels || ""}`;
  }
  return "#";
}

export function gitUrlParse(url: string | URL) {
  const { href, origin, pathname } = new URL(url);
  const [, owner, name] = pathname.split("/");
  return {
    href,
    origin,
    owner,
    name
  };
}