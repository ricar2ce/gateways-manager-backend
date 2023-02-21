# Gateway Manager

This project is a REST service for managing gateways - master devices that control multiple peripheral devices. It uses Node.js/JavaScript for the backend, and MongoDB for the database.

## Requirements

- Node.js v14 or higher
- Yarn package manager
- MongoDB

## Installation

1. Clone the repository: `git clone https://github.com/your-username/gateway-manager.git`
2. Install dependencies: `yarn install`
3. Start the server: `yarn start`

## Usage

The REST service can be accessed through the following routes:

- `GET /api/gateways` - get all gateways
- `GET /api/gateways/:id` - get details of a single gateway
- `POST /api/gateways` - create a new gateway
- `PUT /api/gateways/:id` - update an existing gateway
- `DELETE /api/gateways/:id` - delete a gateway

The request and response format is JSON.

## Testing

To run the tests, execute `yarn test`.

## Contributing

Contributions to this project are welcome. Please follow the steps below to contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b my-new-feature`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Create a new pull request

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
