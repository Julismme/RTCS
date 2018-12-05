// Main Code for LPC1768

#include "mbed.h"

DigitalOut myled(LED1); // use it as a flag
  
DigitalIn HX_DOUT(p19);  // Signal from sensor
DigitalOut HX_PD_SCK(p20); // Clock signal given by mbed
PwmOut servo(p24);

Serial bluetooth(p28,p27);
Serial pc(USBTX, USBRX);

//long ReadWeight(void);
//uint16_t getGram();  
//long getAverageValue(int times);

long offset = 0; // define a golable variable 
 
long ReadWeight(void)   // read the weight just once
{
        long Count;
        unsigned char i;
        HX_PD_SCK.write(0);
        Count = 0;
        while(HX_DOUT.read() == 1);
        for (i=0;i<24;i++)
        {
                HX_PD_SCK.write(1);
                Count=Count<<1;
                HX_PD_SCK.write(0);
                if(HX_DOUT.read() == 1) Count++;
        }
        HX_PD_SCK.write(1);
        Count=Count^0x800000;
        HX_PD_SCK.write(0);
        return(Count);
}

long getAverageValue(int times){   // use ReadWeight to get the average weight 
    long sum = 0;
    for (int i = 0; i < times; i++)
    {
        sum += ReadWeight();
    }
    return sum / times;
} 

uint16_t getGram(){ // get the weight in 20
    return ((getAverageValue(20) - offset))/1000;//*0.0000407059);//8409088
    //return getAverageValue(20);// - offset)*0.00793457031);//8409088
 
}

 
int main()
{
    int t;
    char data[2];
    offset = getAverageValue(20); // get the weight of the plate
    int i;
    int k=0;
    pc.printf("1");
    while (true) {
        
        if (bluetooth.readable()){
            i=bluetooth.getc();
            pc.printf("%d",i);
            if(i==87){//ASCII 'W'=87
                wait(0.5); // wait a small period of time
                int w;
                 w = getGram()*4.76;
                 pc.printf("weight=%d\n", w);
                 //pc.printf("weight = %d \n", getGram()); // print the value of weight
                 bluetooth.printf("%d\n", w); 
            }
            if(i>=48&&i<57){//ASCII '0'=48,'9'=57
                data[k]=i-48;
                ++k;
            }
            if(i==72){//ASCII 'H'=82
                t=data[0]*10+data[1];
                wait(t);
                servo=0.13;
                wait(3);
                servo=0.024;
                wait(3);
                servo=0;
                k=0;
            }
        }
    }
}
