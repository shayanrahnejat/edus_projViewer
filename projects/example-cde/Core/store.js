export const ExampleStore = createStore({
  localStoreKey: 'edus-cde-viewer-example',
  models: [
    { name: 'visits', type: 'detail', store: 'local', defaultData: 0 },
  ],
});
