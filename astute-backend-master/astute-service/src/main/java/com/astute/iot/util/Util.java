package com.astute.iot.util;

import org.springframework.stereotype.Component;

@Component
public class Util {
    private int hex2Decimal(String s) {
        String digits = "0123456789ABCDEF";
        s = s.toUpperCase();
        int val = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            int d = digits.indexOf(c);
            val = 16*val + d;
        }
        return val;
    }
    
	public Float hexToIEEE754(String hexString) {
		return Float.intBitsToFloat(hex2Decimal(hexString));
	}

    //Returns a binary equivalent of a single hexadecimal digit
    public String convertHexaToBinary(String hexa){
        final String[] binaryCodes = {"0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001",
                "1010", "1011", "1100", "1101", "1110", "1111"};
        String binary = null;
        switch (hexa){
            case "A":
                binary = binaryCodes[10];
                break;
            case "B":
                binary = binaryCodes[11];
                break;
            case "C":
                binary = binaryCodes[12];
                break;
            case "D":
                binary = binaryCodes[13];
                break;
            case "E":
                binary = binaryCodes[14];
                break;
            case "F":
                binary = binaryCodes[15];
                break;
            default:
                binary = binaryCodes[Integer.parseInt(hexa)];
        }
        return binary;
    }
}