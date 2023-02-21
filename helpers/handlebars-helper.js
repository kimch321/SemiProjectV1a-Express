Helpers = {
    section: function(name, options) {
        if(!this._sections) this._sections = {}
        this._sections[name] = options.fn(this)
        return null
    },

    eq: function(a, b) {
        let result = false;
        if (a == b && a && b) result = true;
        return result;
    }

};

module.exports = Helpers;