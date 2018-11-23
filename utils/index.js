function required_members(obj, members, res) {
    const errors = {};
    let errors_found = false;

    members.forEach(member => {
        if (obj[member] === undefined){
            errors_found = true;
            errors[member] = "is required"
        }
    })

    if (errors_found) {
        res.status(400).json({ errors });
        return false;
    }
    return true;
}

module.exports = {required_members}