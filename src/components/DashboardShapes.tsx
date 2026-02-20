const MergedShape = ({ fill = "#ffffff", children, style: containerStyle, ...props }) => (
  <div
    style={{
      position: 'relative',
      width: 640,
      height: 290,
      ...containerStyle,
    }}
    {...props}
  >
      {/* Shape 1 */}
      <div
        style={{
          position: 'absolute',
          left: 220,
          top: 0,
          width: 420,
          height: 290,
          backgroundColor: fill,
          borderRadius: '32px 32px 32px 32px',
        }}
      >
        {/* Add content here */}
      </div>
      {/* Shape 2 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 200,
          height: 140,
          backgroundColor: fill,
          borderRadius: '32px 32px 32px 32px',
        }}
      >
        {/* Add content here */}
      </div>
      {/* Shape 3 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 150,
          width: 200,
          height: 140,
          backgroundColor: fill,
          borderRadius: '32px 32px 32px 32px',
        }}
      >
        {/* Add content here */}
      </div>


    {children}
  </div>
);

export default MergedShape;