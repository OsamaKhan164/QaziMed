import { useId, useMemo, useState } from "react";
import { products } from "../data/products.js";
import { suggestProducts } from "../utils/search.js";
import { capitalizeFromInput } from "../utils/text.js";
import { SearchIcon } from "./Icons.jsx";

// One search field with live suggestions from products.js.
//  - onChange(text):  called as the customer types
//  - onSelect(product): called when a suggestion is chosen (click, or Enter on a highlighted one)
//  - onSubmit():      called when Enter is pressed with no suggestion highlighted
//  - suggest:         set to false for a plain live-filter field without the suggestion list
// The first letter of every word is capitalized as the customer types (search itself stays case-insensitive).
function Highlight({ text, query }) {
  const q = query.trim();
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}
    </>
  );
}

export default function ProductSearch({ value, onChange, onSelect, onSubmit, placeholder, id, suggest = true }) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const suggestions = useMemo(() => suggestProducts(products, value, 8), [value]);
  const showList = suggest && open && suggestions.length > 0;
  const showEmpty = suggest && open && value.trim() !== "" && suggestions.length === 0;

  const choose = (product) => {
    setOpen(false);
    setActive(-1);
    onSelect(product);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" && suggestions.length) {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + 1) % suggestions.length);
    } else if (e.key === "ArrowUp" && suggestions.length) {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a <= 0 ? suggestions.length - 1 : a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (showList && active >= 0) choose(suggestions[active]);
      else {
        setOpen(false);
        onSubmit?.();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div className="psearch">
      <div className="searchbar">
        <input
          id={id}
          type="text"
          {...(suggest && {
            role: "combobox",
            "aria-expanded": showList,
            "aria-controls": listId,
            "aria-autocomplete": "list",
            "aria-activedescendant": showList && active >= 0 ? `${listId}-${active}` : undefined,
          })}
          value={value}
          onChange={(e) => {
            // while a phone keyboard is still composing a word, leave the text alone; it is fixed when composition ends
            onChange(e.nativeEvent.isComposing ? e.target.value : capitalizeFromInput(e.target));
            setOpen(true);
            setActive(-1);
          }}
          onCompositionEnd={(e) => onChange(capitalizeFromInput(e.target))}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label={placeholder}
          autoComplete="off"
          autoCapitalize="words"
          spellCheck="false"
        />
        {value && (
          <button type="button" className="searchbar__clear" aria-label="Clear search" onMouseDown={(e) => e.preventDefault()} onClick={() => { onChange(""); setActive(-1); }}>
            ×
          </button>
        )}
        <SearchIcon size={18} />
      </div>

      {showList && (
        <ul className="suggestions" id={listId} role="listbox" aria-label="Matching products">
          {suggestions.map((p, i) => (
            <li
              key={p.productCode}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? "is-active" : ""}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(p)}
              onMouseEnter={() => setActive(i)}
            >
              <span className="suggestions__name"><Highlight text={p.name} query={value} /></span>
              <span className="suggestions__meta">{p.category} · Code {p.productCode}</span>
            </li>
          ))}
        </ul>
      )}
      {showEmpty && <div className="suggestions suggestions--empty" role="status">No matching products</div>}
    </div>
  );
}
