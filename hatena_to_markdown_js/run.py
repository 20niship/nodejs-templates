import re
import sys
from html_to_Markdown.run import *

class Exported_to_Hatena:
    ExportedTXT_object = None

    def __init__(self):
        self.input_file_name = "export_raw.txt"
        self.blog_url = "#"
        self.sarticle_save_name = "$$$DATE$$$_$$$TITLE$$$"

        self.RawArticleTXT = []

        self.article_info = {}  #現在読み込んでいる記事の情報を格納する

        self.article_raw_text = ""
        self.article_info_text_list = []
        
        self.CurState_A = "NONE" #INFORMATION or TEXT
        self.CurState_B = "TEXT" # TEXT, TABLE, IMAGE, LINK,

        self.hatena_text = "" #一記事の最終的なはてな記法テキスト


    def run(self):
        print("---------     Converting EXPORTED to HHATENA   --------------")
        try:
            self.ExportedTXT_object = open(self.input_file_name, encoding="utf-8_sig")
        except:
            print("[ERROR] ファイルを読み込めません！！")
            sys.exit()
        print("--------     input file read succeed   -------------")
        loop = True
        while(loop):
            one_sentence = self.ExportedTXT_object.readline()
            loop = self.readOneSentence(one_sentence)

    def readOneSentence(self, one_sentence):
        if not one_sentence:
            print("---------------   analyzing information    -------------------")
            self.setArticleInfo()
            print("---------------   creating HATENA txt file  -------------------")
            self.hatena_text = ConvertHTML_to_Markdown(self.article_raw_text)
            print("---------------   saving HATENA txt file    -------------------")
            self.SaveOutput()

            print("---------------   全て読み込みが完了しました    -------------------")
            return False

        if ((one_sentence == "-----\n") and self.CurState_A == "TEXT"):
            print("---------------   analyzing information    -------------------")
            self.setArticleInfo()
            print("---------------   creating HATENA txt file  -------------------")
            self.hatena_text = ConvertHTML_to_Markdown(self.article_raw_text)
            print("---------------   saving HATENA txt file    -------------------")
            self.SaveOutput()

            print("new article found !!")
            self.article_info_text_list = []
            self.article_raw_text = ""
            self.CurState_A = "INFORMATION"
            return True

        if ((one_sentence == "--------\n") and self.CurState_A == "INFORMATION"):
            self.CurState_A = "INFORMATION"
            return True

        if ((one_sentence == "--------\n") and self.CurState_A == "TEXT"):
            print("[ERROR-1] テキストが足りませんがこのまま続けます")
            self.CurState_A = "INFORMATION"
            return True

        if ((one_sentence == "-----\n") and self.CurState_A == "INFORMATION"):
            temp_text = self.ExportedTXT_object.readline()
            if(temp_text == "BODY:\n"):
                self.CurState_A = "TEXT"
                print("BODY START")
            return True

        if (self.CurState_A == "TEXT"):
            self.article_raw_text += one_sentence
            return True

        if (self.CurState_A == "INFORMATION"):
            self.article_info_text_list.append(one_sentence.replace("\n", ""))
            return True

        if((one_sentence == "-----\n") and self.CurState_A == "NONE"):
            self.CurState_A = "INFORMATION"
            return True

        return True

    def setArticleInfo(self):
        print(self.article_info_text_list)
        for line in self.article_info_text_list:
            info = line.split(": ")
            if(len(info) == 2):
                info[1] = info[1].replace("\n", "")
                self.article_info[info[0]] = info[1]
                print("[INFO] 記事の情報 -> " + info[0] + " = " + info[1])

    def SaveOutput(self):
        output_filename = self.sarticle_save_name
        for key_name in self.article_info.keys():
            before_txt = "$$$" + key_name.upper() + "$$$"
            after_txt = self.article_info[key_name]
            print(before_txt, after_txt)
            output_filename = output_filename.replace(before_txt, after_txt)

        non_usage_list = [" ", ".", "/", ":", "「", "」", "【", "】", "　", "?", "!", "？", "！", "\\"]
        for temp in non_usage_list:
            output_filename = output_filename.replace(temp, "")

        print("output/" + output_filename)
        f = open("output/" + output_filename + ".txt", "w", encoding="utf-8_sig")

        info_text = ""
        for A_text in self.article_info_text_list:
            info_text += A_text + "\n"
        info_text = info_text.replace(": ", ":")
        f.write(str(info_text + "\n$$$INFO$$$\n" + self.hatena_text))
        print("---------     File Saved    --------------")
        f.close()

A = Exported_to_Hatena()
A.run()
