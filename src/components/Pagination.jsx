import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Pagination(props) {
  const { rowsPerPage, results, page, setPage, setRowsPerPage } = props;
  const totalRows = results;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleFirstPage = () => {
    setPage(0);
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handleLastPage = () => {
    setPage(totalPages - 1);
  };

  return (
    <div className="flex items-center justify-between border-t border-gray bg-white dark:bg-black dark:text-white px-4 py-3 sm:px-6">
        
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          onClick={handlePrevPage}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </a>
        <a
          href="#"
          onClick={handleNextPage}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{`${page + 1}`}</span> to <span className="font-medium">{rowsPerPage}</span> of{' '}
            <span className="font-medium">{results}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md" aria-label="Pagination">
            <span className='flex items-center'>Rows per page:</span>
            <Menu as="div" className="relative inline-block text-left pr-4">
              <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white dark:bg-black dark:text-white px-3 py-2 text-sm font-semibold text-gray hover:bg-neon-green">
                  {rowsPerPage}
                  <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-2 bottom-8 z-10 mt-2 w-16 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {
                      [5, 10, 25].map((item, i) => (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              key={item + i}
                              onClick={() => setRowsPerPage(item)}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              {item}
                            </button>
                          )}
                        </Menu.Item>
                      ))

                    }
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <button
              onClick={handlePrevPage}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray hover:bg-gray-50 dark:text-white focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className='p-2'></div>
            <button
              onClick={handleNextPage}
              className="relative inline-flex dark:text-white items-center rounded-r-md px-2 py-2 text-gray hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
