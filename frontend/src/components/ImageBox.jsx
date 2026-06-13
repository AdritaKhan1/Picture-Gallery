import { useState } from "react";

function ImageBox({ image, title, info }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={expanded ? "image-box expanded" : "image-box"}>
      <img
        src={image}
        alt="Uploaded"
        onClick={() => setExpanded(true)}
      />

      <span
        className="material-icons"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(false);
        }}
      >
        close
      </span>

      {expanded && (
        <div className="image-caption">
          <p className="image-caption-title">{title}</p>
          {info ? <p className="image-caption-info">{info}</p> : null}
        </div>
      )}
    </div>
  );
}

export default ImageBox;
