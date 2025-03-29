import { Link, usePage } from '@inertiajs/react';

function Navbar() {
  const { auth } = usePage().props;
  const { user } = auth;
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          LaraStore
        </Link>
      </div>
      <div className="flex-none gap-4">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {' '}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />{' '}
              </svg>
              <span className="badge badge-sm indicator-item">8</span>
            </div>
          </div>
          <div
            tabIndex={0}
            className="card-compact z-1 card dropdown-content mt-3 w-52 bg-base-100 shadow"
          >
            <div className="card-body">
              <span className="text-lg font-bold">8 Items</span>
              <span className="text-info">Subtotal: $999</span>
              <div className="card-actions">
                <button className="btn btn-primary btn-block">View cart</button>
              </div>
            </div>
          </div>
        </div>
        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="z-1 dropdown-content menu menu-sm mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li>
                <Link href={route('profile.edit')} className="justify-between">
                  Profile
                </Link>
              </li>

              <li>
                <Link href={route('logout')} method="post" as="button">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link href={route('login')} className="btn">
              Login
            </Link>
            <Link href={route('register')} className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;

{
  /* <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 justify-between">
      <div className="flex">
        <div className="flex shrink-0 items-center">
          <Link href="/">
            <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
          </Link>
        </div>

        <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
          <NavLink
            href={route('dashboard')}
            active={route().current('dashboard')}
          >
            Dashboard
          </NavLink>
        </div>
      </div>

      <div className="hidden sm:ms-6 sm:flex sm:items-center">
        <div className="relative ms-3">
          <Dropdown>
            <Dropdown.Trigger>
              <span className="inline-flex rounded-md">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {user.name}

                  <svg
                    className="-me-0.5 ms-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            </Dropdown.Trigger>

            <Dropdown.Content>
              <Dropdown.Link href={route('profile.edit')}>
                Profile
              </Dropdown.Link>
              <Dropdown.Link href={route('logout')} method="post" as="button">
                Log Out
              </Dropdown.Link>
            </Dropdown.Content>
          </Dropdown>
        </div>
      </div>

      <div className="-me-2 flex items-center sm:hidden">
        <button
          onClick={() =>
            setShowingNavigationDropdown((previousState) => !previousState)
          }
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
        >
          <svg
            className="h-6 w-6"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <div
    className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}
  >
    <div className="space-y-1 pb-3 pt-2">
      <ResponsiveNavLink
        href={route('dashboard')}
        active={route().current('dashboard')}
      >
        Dashboard
      </ResponsiveNavLink>
    </div>

    <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
      <div className="px-4">
        <div className="text-base font-medium text-gray-800 dark:text-gray-200">
          {user.name}
        </div>
        <div className="text-sm font-medium text-gray-500">{user.email}</div>
      </div>

      <div className="mt-3 space-y-1">
        <ResponsiveNavLink href={route('profile.edit')}>
          Profile
        </ResponsiveNavLink>
        <ResponsiveNavLink method="post" href={route('logout')} as="button">
          Log Out
        </ResponsiveNavLink>
      </div>
    </div>
  </div>
</nav>; */
}
