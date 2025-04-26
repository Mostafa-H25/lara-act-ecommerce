import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import Modal from '@/Components/Core/Modal';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import SecondaryButton from '@/Components/Core/SecondaryButton';
import TextInput from '@/Components/Core/TextInput';
import { useForm, usePage } from '@inertiajs/react';
import { ChangeEvent, FormEventHandler, useState } from 'react';

const VendorDetails = ({ className = '' }: { className?: string }) => {
  const user = usePage().props.auth.user;
  const token = usePage().props.csrf_token;
  const [showBecomeVendorConfirmation, setShowBecomeVendorConfirmation] =
    useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { data, setData, errors, post, processing, recentlySuccessful } =
    useForm({
      store_name:
        user.vendor?.store_name ||
        user.name.toLocaleLowerCase().replace(/\s+/g, '-'),
      store_address: user.vendor?.store_address,
    });

  const onStoreNameChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setData('store_name', ev.target.value.toLowerCase().replace(/\s+/g, '-'));
  };

  const becomeVendor: FormEventHandler = (ev) => {
    ev.preventDefault();

    post(route('vendor.store'), {
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
        setSuccessMessage('You can now create and publish products');
      },
    });
  };

  const updateVendor: FormEventHandler = (ev) => {
    ev.preventDefault();

    post(route('vendor.store'), {
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
        setSuccessMessage('Your details are updated.');
      },
    });
  };

  const closeModal = () => {
    setShowBecomeVendorConfirmation(false);
  };

  return (
    <section className={className}>
      {recentlySuccessful && (
        <div className="toast toast-end toast-top">
          <div className="alert alert-success">
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      {user.vendor && (
        <header className="mb-8 flex justify-between text-lg font-medium text-gray-900 dark:text-gray-100">
          Vendor Details
          {user.vendor?.status === 'pending' && (
            <span className="badge badge-warning">
              {user.vendor?.status_label}
            </span>
          )}
          {user.vendor?.status === 'rejected' && (
            <span className="badge badge-error">
              {user.vendor?.status_label}
            </span>
          )}
          {user.vendor?.status === 'approved' && (
            <span className="badge badge-success">
              {user.vendor?.status_label}
            </span>
          )}
        </header>
      )}
      <div>
        {!user.vendor ? (
          <PrimaryButton
            onClick={() => setShowBecomeVendorConfirmation(true)}
            disabled={processing}
            className="w-full"
          >
            Become a Vendor
          </PrimaryButton>
        ) : (
          <>
            <form onSubmit={updateVendor}>
              <InputLabel htmlFor="name" value="Store Name" />
              <TextInput
                id="name"
                className="mt-1 block w-full"
                value={data.store_name}
                onChange={onStoreNameChange}
                required
                isFocused
                autoComplete="name"
              />
              <InputError className="mt-2" message={errors.store_name} />
              <div className="mb-4">
                <InputLabel htmlFor="name" value="Store Address" />
                <textarea
                  className="textarea-bordered textarea mt-1 w-full"
                  value={data.store_address}
                  placeholder="Enter Your Store Address"
                  onChange={(e) => setData('store_address', e.target.value)}
                ></textarea>
                <InputError className="mt-2" message={errors.store_address} />
              </div>
              <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing}>Update</PrimaryButton>
              </div>
            </form>
            <form
              action={route('stripe.connect')}
              method="post"
              className="my-8"
            >
              <input type="hidden" name="_token" value={token} />
              {user.stripe_account_active && (
                <div className="my-4 text-center text-sm text-gray-600">
                  You are successfully connected to stripe.
                </div>
              )}
              <button
                className="btn btn-primary w-full"
                disabled={user.stripe_account_active}
              >
                Connect to Stripe
              </button>
            </form>
          </>
        )}
      </div>
      <Modal show={showBecomeVendorConfirmation} onClose={closeModal}>
        <form onSubmit={becomeVendor} className="p-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Are you sure you want to become a vendor?
          </h2>
          <div className="mt-6 flex justify-end">
            <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
            <PrimaryButton className="ms-3" disabled={processing}>
              Confirm
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default VendorDetails;
