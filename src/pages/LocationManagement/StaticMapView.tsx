const StaticMapView: React.FC<{ locations: any[] }> = ({ locations }) => {
  if (locations.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="w-12 h-12 text-gray-400 mx-auto mb-4">🗺️</div>
          <p className="text-gray-600 text-lg mb-2">No locations to display</p>
          <p className="text-gray-500">
            Search for an address to see it on the map
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-blue-50 rounded-lg border border-gray-200 p-6">
      <div className="h-full flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Map View (Interactive map loading...)
        </h3>
        <div className="flex-1 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-gray-600">Interactive map is loading...</p>
            <p className="text-sm text-gray-500 mt-2">
              Found {locations.length} location
              {locations.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticMapView;
