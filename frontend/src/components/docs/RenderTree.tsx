import FileTree, { Folder, File } from "./FileTree";
import backendTree from "./backend-structure.json";
import frontendTree from "./frontend-structure.json";

// JSON 데이터를 기반으로 재귀적 렌더링
function RenderTree({ tree }) {
  if (tree.type === "folder") {
    return (
        <Folder name={tree.name} defaultOpen={tree.defaultOpen}>
          {tree.children.map((child, index) => (
              <RenderTree key={index} tree={child} />
          ))}
        </Folder>
    );
  }

  if (tree.type === "file") {
    return <File name={tree.name} />;
  }

  return null;
}

export default function RenderTreeComponent() {
  return (
      <div className="flex justify-center my-4 gap-2">
        <FileTree>
          <RenderTree tree={backendTree} />
        </FileTree>

        <FileTree>
          <RenderTree tree={frontendTree} />
        </FileTree>
      </div>
  );
}