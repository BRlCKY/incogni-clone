const HelpCenterComp = () => {
     const boxes = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="demo-grid">
        {boxes.map((num) => (
          <div key={num} className="box">
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpCenterComp;