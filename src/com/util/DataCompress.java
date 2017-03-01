package com.util;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

import org.mortbay.log.Log;

public class DataCompress {

	/**
	 * GZIP compression Method
	 * @param data
	 * @return
	 */
	public static String compression(String data){
		ByteArrayOutputStream byteoutput = null;
		GZIPOutputStream gzipout ;
		String responsedata = null;
		System.out.println("Orginal size"+data.length());
		try{
			byteoutput = new ByteArrayOutputStream();
			gzipout = new GZIPOutputStream(byteoutput);
			gzipout.write(data.getBytes("ISO-8859-1"));
			gzipout.close();
			responsedata = byteoutput.toString("ISO-8859-1");
			System.out.println("compressed data size: "+byteoutput.size());
		}
		catch(IOException e){
			Log.warn(e.getMessage());
		}
		
		return responsedata;
	}
	/**
	 * Gzip decompression method
	 * @param data
	 * @return
	 */
	public static String deCompression(String data){		
		GZIPInputStream gzipin;		
		String outData ="";
		try {
			gzipin = new GZIPInputStream(new ByteArrayInputStream(data.getBytes("ISO-8859-1")));
			BufferedReader br = new BufferedReader(new InputStreamReader(gzipin));
			String line;
			while((line = br.readLine())!= null){
				outData += line;
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			Log.warn(e.getMessage());
		}
		return outData;
	}

}
