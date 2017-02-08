package invoke
import (
	"github.com/pkg/errors"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"encoding/json"
	"build-chaincode/data"
	"build-chaincode/utils"
)

var logger = shim.NewLogger("invoke")

func main() {
	logger.SetLevel(shim.LogDebug)
}

var Functions = map[string]func(shim.ChaincodeStubInterface,[]string)([]byte, error) {
    "add_user": add_user,
    "add_thing": add_thing,
    "remove_thing": remove_thing,
    "add_test_data": add_test_data,
		"update_things": update_things,
}

// Invoke function.
func Invoke(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	logger.Infof("-- Invoking function %v with args %v", function, args)

	if function == "init" {
		return Init(stub, "init", args)
    } else {
        return Functions[function](stub,args)
    }

	return nil, errors.New("Received unknown invoke function name")
}

//==============================================================================================================================
//	Init Function - Called when the user deploys the chaincode
//==============================================================================================================================

func Init(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	logger.Infof("Deployed chaincode.")
	return nil, data.ResetIndexes(stub)
}

//==============================================================================================================================
//		Invoke Functions
//==============================================================================================================================

func add_test_data(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
    var usersIndex = args[0]
    var thingsIndex = args[1]

    var users []data.User
    err := json.Unmarshal([]byte(usersIndex), &users)
	if err != nil { return nil, err }
    for _,user := range users {
        data.Save(stub, user)
    }

    var things []data.Thing
    err = json.Unmarshal([]byte(thingsIndex), &things)
	if err != nil { return nil, err }
    for _,thing := range things {
        data.Save(stub, thing)
    }
    return nil,err
}

// args 0 is the caller id (not anymore needed in fabric v. 0.6)
func add_user(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var item data.User
	err := json.Unmarshal([]byte(args[1]), &item)
	if err != nil { return nil, err }
	return nil, data.Save(stub, item)
}

func add_thing(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	// Unmarshal JSON to Thing model
	var item data.Thing
	err := json.Unmarshal([]byte(args[1]), &item)
	if err != nil { return nil, err }

	// Save new thing
	err = data.Save(stub, item)
	if err != nil { return nil, err }

	// Fetch user
	var user data.User
	err = utils.Get(stub, &user, args[2])
	if err != nil {
		return nil, errors.Wrap(err, "Could not get user "+args[2])
	}

	// Attach thing id to user's Things
	user.Things = append(user.Things, item.Id)

	// Save user
	return nil, data.Save(stub, user)
}

func remove_thing(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	// Unmarshal JSON to Thing model
	var item data.Thing
	err := json.Unmarshal([]byte(args[1]), &item)
	if err != nil { return nil, err }

	// Fetch user
	var user data.User
	err = utils.Get(stub, &user, args[2])
	if err != nil {
		return nil, errors.Wrap(err, "Could not get user "+args[2])
	}

	// Disattach thing id from user's Things
	for i, v := range user.Things {
		if v == item.Id {
			user.Things = append(user.Things[:i], user.Things[i+1:]...)
			break
		}
	}

	// Save user
	return nil, data.Save(stub, user)
}

func update_things(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	// Unmarshal JSON to Thing model
	var item data.Thing
	err := json.Unmarshal([]byte(args[1]), &item)
	if err != nil { return nil, err }

	// Save new thing
	err = data.Save(stub, item)
	if err != nil { return nil, err }

	// Fetch user
	var user data.User
	err = utils.Get(stub, &user, args[2])
	if err != nil {
		return nil, errors.Wrap(err, "Could not get user "+args[2])
	}

	// Attach thing id to user's Things
	user.Things = append(user.Things, item.Id)

	// Save user
	return nil, data.Save(stub, user)
}
