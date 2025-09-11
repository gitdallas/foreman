import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { translate as __ } from 'foremanReact/common/I18n';
import { Table } from '@patternfly/react-table';
import { Button } from '@patternfly/react-core';
import SearchBar from '../SearchBar';
import Pagination from '../Pagination';
import BreadcrumbBar from '../BreadcrumbBar';

const ActivationKeys = () => {
  const history = useHistory();
  const [activationKeys, setActivationKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    total: 0,
  });

  // Fetch activation keys data
  useEffect(() => {
    const fetchActivationKeys = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          page: pagination.page,
          per_page: pagination.perPage,
          sort_by: 'name',
          sort_order: 'ASC',
        });

        const response = await fetch(`/katello/api/activation_keys?${params}`);
        const data = await response.json();

        setActivationKeys(data.results || []);
        setPagination(prev => ({
          ...prev,
          total: data.total || 0,
        }));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching activation keys:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivationKeys();
  }, [searchTerm, pagination.page, pagination.perPage]);

  const handleSearch = search => {
    setSearchTerm(search);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = page => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleNewActivationKey = () => {
    history.push('/activation_keys/new');
  };

  const columns = [
    { title: __('Name') },
    { title: __('Lifecycle Environment') },
    { title: __('Content View') },
    { title: __('Usage Limit') },
    { title: __('Actions') },
  ];

  const rows = activationKeys.map(key => [
    key.name,
    key.environment?.name || '',
    key.content_view?.name || '',
    key.usage_limit === -1 ? __('Unlimited') : key.usage_limit,
    <Button
      key="view"
      variant="link"
      onClick={() => history.push(`/activation_keys/${key.id}`)}
      ouiaId={`activation-key-view-${key.id}`}
    >
      {__('View')}
    </Button>,
  ]);

  const breadcrumbItems = [
    { caption: __('Activation Keys'), url: '/activation_keys' },
  ];

  if (loading && activationKeys.length === 0) {
    return <div>{__('Loading...')}</div>;
  }

  return (
    <div>
      <BreadcrumbBar
        breadcrumbItems={breadcrumbItems}
        switcherItemUrl="/activation_keys"
        searchable
        onSearchChange={handleSearch}
      />

      <div className="activation-keys-header">
        <h1>{__('Activation Keys')}</h1>
        <Button
          variant="primary"
          onClick={handleNewActivationKey}
          ouiaId="create-activation-key"
        >
          {__('Create Activation Key')}
        </Button>
      </div>

      <SearchBar
        onSearch={handleSearch}
        searchQuery={searchTerm}
        data={{ controller: 'katello_activation_keys' }}
      />

      <Table
        aria-label="Activation Keys Table"
        columns={columns}
        rows={rows}
        ouiaId="activation-keys-table"
      />

      <Pagination
        totalItems={pagination.total}
        perPage={pagination.perPage}
        currentPage={pagination.page}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ActivationKeys;
