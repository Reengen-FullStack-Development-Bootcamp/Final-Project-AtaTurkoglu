export const validation = {
  methods: {
    check(value, type) {
      if (value) {
        if (type == 'text') {
          return true || 'must be text';
        } else if (type == 'integer') {
          return (
            (Number(value) &&
              value >= -2147483648 &&
              value <= 2147483648 &&
              !String(value).includes('.')) ||
            'must be number, between -2147483648 and 2147483648'
          );
        } else if (type == 'smallint') {
          return (
            (Number(value) &&
              value >= -32767 &&
              value <= 32767 &&
              !String(value).includes('.')) ||
            'must be number, between -32768 and 32768'
          );
        } else if (type == 'bigint') {
          return (
            (Number(value) &&
              value >= -9223372036854775808 &&
              value <= 9223372036854775808) ||
            'must be number, between -9223372036854775808  and 9223372036854775808'
          );
        } else if (type == 'numeric') {
          if (String(value).includes('.')) {
            return (
              (Number(value) &&
                String(value).split('.')[0].length <= 131072 &&
                String(value).split('.')[1].length <= 16383) ||
              'must be number, up to 131072 digits before the decimal point; up to 16383 digits after the decimal point'
            );
          } else {
            return (
              (Number(value) &&
                String(value).split('.')[0].length <= 131072 &&
                value <= 9223372036854775808) ||
              'must be number, up to 131072 digits before the decimal point; up to 16383 digits after the decimal point'
            );
          }
        } else if (type == 'cidr') {
          return (
            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
              value,
            ) || 'must be IPv4 network'
          );
        } else if (type == 'macaddr') {
          return (
            /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(value) ||
            'must be MAC address'
          );
        } else if (String(type).slice(0, 4) == 'char') {
          return (
            String(value).length <= type.slice(type.indexOf('(') + 1, -1) ||
            `must be max ${type.slice(type.indexOf('(') + 1, -1)} characters`
          );
        }
      } else {
        return true;
      }
    },
  },
};
