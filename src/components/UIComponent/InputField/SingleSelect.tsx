'use client';
import {
  useEffect,
  useRef,
  useState,
  MouseEvent,
  FC,
  ChangeEvent,
} from 'react';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  render: (item: string) => JSX.Element;
  className?: string;
  items: string[];
}

const SingleSelect: FC<SelectProps> = ({
  value,
  onChange,
  render,
  className = '',
  items = [],
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState('');
  const handleItemClick = (item: string): void => {
    onChange(item);
    setSelectedItem(item);
    setShowModal(false);
    setSearchTerm('');
  };

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    function handleClickOutside(event: Event): void {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    }

    if (showModal) {
      window.addEventListener('click', handleClickOutside);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [showModal]);

  return (
    <>
      <div className=" relative my-1 max-h-[300px] text-xs" ref={dropdownRef}>
        {' '}
        <input
          placeholder="Select"
          value={selectedItem} // Display selected item
          readOnly
          className="block w-full rounded-lg border-gray-200 px-3 py-2 text-xs before:absolute before:inset-0 before:z-[1] focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          onClick={() => setShowModal(!showModal)}
        />
        <div className="absolute end-3 top-1/2 -translate-y-1/2">
          <svg
            className="h-3.5 w-3.5 flex-shrink-0 text-gray-500 dark:text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
          </svg>
        </div>
        {showModal && (
          <div className="absolute z-20 mt-2  w-full space-y-0.5 overflow-hidden overflow-y-auto rounded-lg border border-gray-200 bg-white px-1 pb-1 dark:border-gray-700 dark:bg-slate-900">
            <div className="   ">
              <div className=" relative flex max-h-[300px] flex-col overflow-hidden bg-white">
                <div className=" h-[50px] w-full bg-white p-2">
                  {' '}
                  <div className="flex">
                    <input
                      className="  w-full rounded-lg border-gray-200 px-3 py-2 text-xs before:absolute before:inset-0 before:z-[1] focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="h-[250px] overflow-auto p-2">
                  {' '}
                  <ul>
                    {filteredItems.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => handleItemClick(item)}
                        className="w-full cursor-pointer rounded-lg px-4 py-2 text-xs text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
                      >
                        {render(item)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SingleSelect;
