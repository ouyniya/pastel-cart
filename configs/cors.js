exports.dynamicCorsOptions = function (req, callback) {
  let corsOptions;

  //   if (req.path.startWith("/api/auth/")) {
  //     corsOptions = {
  //       origin: "http://localhost:5173",
  //       Credential: true,
  //     };
  //   } else {
  //     corsOptions: {
  //       origin: "*";
  //     }
  //   }

  corsOptions = {
    origin: "http://localhost:5173",
    Credential: true,
  };

  callback(null, corsOptions);
};
